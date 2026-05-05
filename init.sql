CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    address_line VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL DEFAULT '',
    alarm_panel VARCHAR(100) NOT NULL DEFAULT '',
    image VARCHAR(500) DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alarm_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    zone_key VARCHAR(10) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    lang VARCHAR(5) NOT NULL DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(customer_id, zone_key, lang)
);

CREATE TABLE IF NOT EXISTS ha_lights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    light_key VARCHAR(10) UNIQUE NOT NULL,
    entity_id VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL DEFAULT '',
    top VARCHAR(20) DEFAULT '',
    left_pos VARCHAR(20) DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS movies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    movie_key VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS songs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    song_key VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO admin_users (username, password_hash) VALUES
    ('admin', '$2a$10$FQaZg2eEZVYe0E3z2HaO4uEx8GIpsda1HC3NGPhDD9UXKgu8fj9wK')
ON CONFLICT (username) DO NOTHING;

INSERT INTO customers (slug, address_line, city, alarm_panel, image) VALUES
    ('10050westminster', '10050 Westminster Hwy', 'Richmond', 'DSC1864', 'https://pixy.org/src/0/thumbs350/2829.jpg'),
    ('1072dutchess', '1072 dutchess ave', 'West Vancouver', 'Vista20P', ''),
    ('1095mathers', '1195 mathers st', 'west vancovuer', 'DSC', 'https://i.pinimg.com/originals/a2/25/4b/a2254befe60bcc226e7f7c8eae7e207e.jpg'),
    ('1095millstream', '1095 millstream st', 'west vancovuer', 'dsc', 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/brewster-mcleod-architects-1486154143.jpg'),
    ('1108 esquimalt', '1108 esquimalt ave', 'west vancouver', 'DSC1832', ''),
    ('1118esquimalt', '1118 esquimalt', 'West Vancouver', 'Dsc1832', ''),
    ('11351blundell', '11351 blundell rd', 'Richmond', 'DSC1864', 'https://pixy.org/src/0/thumbs350/2829.jpg'),
    ('1231inglewood', '1231 inglewood ave', 'west vancouver', 'DSC', 'https://i.pinimg.com/originals/c4/16/99/c41699661f768457f5fb3bbdfe80aaad.jpg'),
    ('1291duchess', '1291 duchess st', 'West Vancouver', 'DSC1832', ''),
    ('165 E woodstock', '165 E Woodstock', 'vancouver', 'DSC1832', ''),
    ('167&163w45', '167/163 w45     ave', 'vancouver', 'dsc', 'https://i.pinimg.com/originals/a2/25/4b/a2254befe60bcc226e7f7c8eae7e207e.jpg'),
    ('1706killenny', '1706 kilkenny rd', 'north vancouver', 'DSC', 'https://i.pinimg.com/originals/a2/25/4b/a2254befe60bcc226e7f7c8eae7e207e.jpg'),
    ('1832acadia', '1832 acadia rd', 'Vancouver', 'DSC1832', 'https://pixy.org/src/0/thumbs350/2829.jpg'),
    ('200chippendale', '200 chippendale', 'west vancovuer', 'DSC2632', ''),
    ('2185westhill', '2185 west hill dr', 'west vancouver', 'DSC1832', 'https://pixy.org/src/0/thumbs350/2829.jpg'),
    ('2264inglewood', '2264 inglewood', 'West Vancouver', 'Vista20P', ''),
    ('2298palmerstone', '2298 palmerston st', 'west vancovuer', 'dsc', 'https://i.pinimg.com/originals/a2/25/4b/a2254befe60bcc226e7f7c8eae7e207e.jpg'),
    ('2495mathers', '2495 Mathers St', 'West Vancouver', 'DSC1832', ''),
    ('2588w21', '2588 w 21 ave', 'vancovuer', 'DSC', 'https://i.pinimg.com/originals/a2/25/4b/a2254befe60bcc226e7f7c8eae7e207e.jpg'),
    ('2661mcbain', '2661 mcbain ave', 'vancouver', 'DSC1832', ''),
    ('2722w32', '2722 w 32 ave', 'vancovuer', 'dsc', 'https://i.pinimg.com/originals/a2/25/4b/a2254befe60bcc226e7f7c8eae7e207e.jpg'),
    ('2781lawson', '2781 Lawson St', 'West Vancouver', 'DSC', 'https://i.pinimg.com/originals/a2/25/4b/a2254befe60bcc226e7f7c8eae7e207e.jpg'),
    ('3228w20', '3228 w20th ave', 'vancouver', 'DSC1832', ''),
    ('3309w19', '3309 w 19 ave', 'vancovuer', 'DSC', 'https://i.pinimg.com/originals/a2/25/4b/a2254befe60bcc226e7f7c8eae7e207e.jpg'),
    ('3325marinedr', '3325 marine dr', 'west vancouver', 'DSC1632', 'https://i.pinimg.com/originals/a2/25/4b/a2254befe60bcc226e7f7c8eae7e207e.jpg'),
    ('3541w29', '3541 w 29th ave', '', 'DSC1832', 'https://i.pinimg.com/originals/a2/25/4b/a2254befe60bcc226e7f7c8eae7e207e.jpg'),
    ('3711w24', '3711 w24', 'Vancouver', 'DSC', ''),
    ('3891brockton', '3891 brockton cres', 'north vancouver', 'DSC1832', ''),
    ('4085norwood', '4085 norwood', 'north vancouver', 'dsc', 'https://i.pinimg.com/originals/a2/25/4b/a2254befe60bcc226e7f7c8eae7e207e.jpg'),
    ('4437w7', '4437 w 7th ave', 'Vancouver', 'DSC1864', 'https://i.pinimg.com/originals/a2/25/4b/a2254befe60bcc226e7f7c8eae7e207e.jpg'),
    ('495E60', '495 E 60 ave', 'vancouver', 'dsc neo HS2032', ''),
    ('539evergreen', '539 Evergreen Pl', 'North Vancouver', 'DSC1864', ''),
    ('5755angus', '5755 angus st', 'vancouver', 'dsc', 'https://i.pinimg.com/originals/a2/25/4b/a2254befe60bcc226e7f7c8eae7e207e.jpg'),
    ('5887adera', '5887 adera st', 'vancouver', 'dsc', 'https://i.pinimg.com/originals/a2/25/4b/a2254befe60bcc226e7f7c8eae7e207e.jpg'),
    ('5911adera', '5911 adera st', 'Vancouver', 'DSC1832', 'https://i.pinimg.com/originals/a2/25/4b/a2254befe60bcc226e7f7c8eae7e207e.jpg'),
    ('5937margurrite', '5937 margurrite', 'Vancouver', 'DSC1832', 'https://i.pinimg.com/originals/a2/25/4b/a2254befe60bcc226e7f7c8eae7e207e.jpg'),
    ('6615balsam', '6615 balsam st', 'Vancouver', 'DSC1832', ''),
    ('7061adera', '7061 adera st', 'vancouver', 'vista20p', '')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO ha_lights (light_key, entity_id, name, top, left_pos) VALUES
    ('001', 'light.hall_closet_ceiling_light', 'family', '30%', '30%'),
    ('002', 'light.hall_closet_ceiling_light', 'washroom', '50%', '60%')
ON CONFLICT (light_key) DO NOTHING;

INSERT INTO movies (movie_key, name, url) VALUES
    ('001', 'The Curious Case of Benjamin Button', 'https://firebasestorage.googleapis.com/v0/b/customer-f29a1.appspot.com/o/movie%2F790959164419468023195632.mp4?alt=media&token=e9da1300-fad8-4378-82a8-0eb5f3d3be06'),
    ('002', 'Eight Below', 'https://firebasestorage.googleapis.com/v0/b/customer-f29a1.appspot.com/o/movie%2Feight.below.2006.720p.brrip.x264.yify.mp4?alt=media&token=01e4f31c-827f-44ec-b556-90cad021bc11'),
    ('003', 'One Day', 'https://firebasestorage.googleapis.com/v0/b/customer-f29a1.appspot.com/o/movie%2Fone.day.2011.720p.x264.brrip.yify.mp4?alt=media&token=78d3c147-9d1e-4e2f-86e4-0b30f32e45e7')
ON CONFLICT (movie_key) DO NOTHING;

INSERT INTO songs (song_key, name, url) VALUES
    ('001', '女孩', 'https://firebasestorage.googleapis.com/v0/b/customer-f29a1.appspot.com/o/song%2F%E8%B4%B9%E7%BF%94%20-%20%E5%A5%B3%E5%AD%A9%E5%A5%B3%E5%AD%A9.mp3?alt=media&token=74fd9e4b-059c-4895-9a34-38ecfa07b8bb'),
    ('002', '呢喃', 'https://firebasestorage.googleapis.com/v0/b/customer-f29a1.appspot.com/o/song%2F%E8%B4%B9%E7%BF%94%20-%20%E5%91%A2%E5%96%83.mp3?alt=media&token=717c603c-d699-476a-b786-e25cae5319ca'),
    ('003', '一阵恼人的秋风', 'https://firebasestorage.googleapis.com/v0/b/customer-f29a1.appspot.com/o/song%2F%E8%B4%B9%E7%BF%94%20-%20%E4%B8%80%E9%98%B5%E6%81%BC%E4%BA%BA%E7%9A%84%E7%A7%8B%E9%A3%8E.mp3?alt=media&token=850a42fc-e17a-4e23-82f0-b3699276d71a'),
    ('004', '在雨中', 'https://firebasestorage.googleapis.com/v0/b/customer-f29a1.appspot.com/o/song%2F%E8%B4%B9%E7%BF%94%20-%20%E5%9C%A8%E9%9B%A8%E4%B8%AD.mp3?alt=media&token=6fbdbb5d-8157-4997-a9fb-7fb5f7d24ef6'),
    ('005', '安娜', 'https://firebasestorage.googleapis.com/v0/b/customer-f29a1.appspot.com/o/song%2F%E8%B4%B9%E7%BF%94%20-%20%E5%AE%89%E5%A8%9C.mp3?alt=media&token=4096adf1-9588-486c-9b4c-7a36f3ffc275'),
    ('006', '最后的华尔兹', 'https://firebasestorage.googleapis.com/v0/b/customer-f29a1.appspot.com/o/song%2F%E8%B4%B9%E7%BF%94%20-%20%E6%9C%80%E5%90%8E%E7%9A%84%E5%8D%8E%E5%B0%94%E5%85%B9.mp3?alt=media&token=6605e817-99ea-4a65-9d4f-d71368117c32')
ON CONFLICT (song_key) DO NOTHING;
