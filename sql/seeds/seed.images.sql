USE portfolio;

-- Insert canonical images
INSERT INTO images (img_name, img_url)
VALUES
('Empty Chat Screen', 'https://i.postimg.cc/SsTp9WSp/simple-Chat-empty.png'),
('Pre-send UI State', 'https://i.postimg.cc/W47V2Bxz/simple-Chat-pre-sent.png'),
('Message Sent UI', 'https://i.postimg.cc/wBzHYqfn/simple-Chat-sent-message.png'),
('2-Way Communication', 'https://i.postimg.cc/Wzdcwhzq/simple-Chat-2-way-communication.png'),
('Multiple Messages', 'https://i.postimg.cc/RFVBqPzR/simple-Chat-multiple-messages.png'),
('Socket Connection Log', 'https://i.postimg.cc/3xm7q4Bg/simple-Chat-socket-connection.png')
ON DUPLICATE KEY UPDATE img_url = VALUES(img_url);

-- Link images to Simple Chat project with thumbnail info
SET @project_id = (SELECT id FROM projects WHERE slug = 'simple-chat');

-- Get image IDs
SET @img1 = (SELECT id FROM images WHERE img_name = 'Empty Chat Screen');
SET @img2 = (SELECT id FROM images WHERE img_name = 'Pre-send UI State');
SET @img3 = (SELECT id FROM images WHERE img_name = 'Message Sent UI');
SET @img4 = (SELECT id FROM images WHERE img_name = '2-Way Communication');
SET @img5 = (SELECT id FROM images WHERE img_name = 'Multiple Messages');
SET @img6 = (SELECT id FROM images WHERE img_name = 'Socket Connection Log');

INSERT INTO project_images (project_id, image_id, is_thumbnail)
VALUES
(@project_id, @img1, FALSE),
(@project_id, @img2, FALSE),
(@project_id, @img3, FALSE),
(@project_id, @img4, TRUE),
(@project_id, @img5, FALSE),
(@project_id, @img6, FALSE)
ON DUPLICATE KEY UPDATE
    is_thumbnail = VALUES(is_thumbnail);
