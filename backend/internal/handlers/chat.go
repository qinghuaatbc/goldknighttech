package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
)

type ChatRequest struct {
	Message string `json:"message"`
	History []struct {
		Role    string `json:"role"`
		Content string `json:"content"`
	} `json:"history,omitempty"`
}

type ChatResponse struct {
	Reply string `json:"reply"`
}

func Chat(w http.ResponseWriter, r *http.Request) {
	var req ChatRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonError(w, "invalid request", http.StatusBadRequest)
		return
	}

	apiKey := os.Getenv("OPENAI_API_KEY")
	if apiKey == "" {
		jsonError(w, "AI service not configured", http.StatusInternalServerError)
		return
	}

	baseURL := os.Getenv("OPENAI_BASE_URL")
	if baseURL == "" {
		baseURL = "https://api.openai.com"
	}

	messages := []map[string]string{
		{"role": "system", "content": `You are Gold Knight Tech's smart home assistant. You help customers with:
- Home automation questions (security, lighting, audio, theater, networking)
- Explaining services and solutions
- Booking consultations
- Answering technical questions about smart home products

Keep responses friendly, concise, and helpful. If asked about pricing, suggest contacting for a free quote.
Always mention you're from Gold Knight Tech, Vancouver's smart home experts since 2014.`},
	}

	for _, h := range req.History {
		messages = append(messages, map[string]string{"role": h.Role, "content": h.Content})
	}
	messages = append(messages, map[string]string{"role": "user", "content": req.Message})

	body := map[string]interface{}{
		"model":       "gpt-4o-mini",
		"messages":    messages,
		"max_tokens":  500,
		"temperature": 0.7,
	}

	b, _ := json.Marshal(body)
	apiReq, _ := http.NewRequest("POST", baseURL+"/v1/chat/completions", bytes.NewReader(b))
	apiReq.Header.Set("Content-Type", "application/json")
	apiReq.Header.Set("Authorization", "Bearer "+apiKey)

	resp, err := http.DefaultClient.Do(apiReq)
	if err != nil {
		jsonError(w, "AI service unavailable", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)

	if resp.StatusCode != 200 {
		jsonError(w, fmt.Sprintf("AI error: %s", string(respBody)), http.StatusInternalServerError)
		return
	}

	var result struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
	}
	if err := json.Unmarshal(respBody, &result); err != nil || len(result.Choices) == 0 {
		jsonError(w, "AI parse error", http.StatusInternalServerError)
		return
	}

	jsonResponse(w, ChatResponse{Reply: strings.TrimSpace(result.Choices[0].Message.Content)}, http.StatusOK)
}
