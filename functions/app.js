const express = require('express');
const serverless = require('serverless-http');
const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.static('public'));

app.get('/.netlify/functions/app/download', async (req, res) => {
    const videoUrl = req.query.videoUrl;
    const fileFormat = req.query.format || 'mp4';

    if (!videoUrl) {
        return res.status(400).send('Please provide a valid YouTube video URL');
    }

    try {
        const info = await ytdl.getInfo(videoUrl);
        res.setHeader('Content-disposition', `attachment; filename="${info.videoDetails.title}.${fileFormat}"`);

        if (fileFormat === 'mp3') {
            const audioStream = ytdl(videoUrl, { filter: 'audioonly' });
            const outputPath = path.join('/tmp', `${info.videoDetails.title}.mp3`);

            audioStream.pipe(fs.createWriteStream(outputPath));

            audioStream.on('end', () => {
                res.sendFile(outputPath, () => {
                    fs.unlink(outputPath, (err) => {
                        if (err) {
                            console.error('Error deleting temporary file:', err);
                        }
                    });
                });
            });
        } else {
            res.setHeader('Content-type', `video/${fileFormat}`);
            ytdl(videoUrl, { quality: 'highest' }).pipe(res);
        }
    } catch (error) {
        console.error('Error downloading video:', error);
        res.status(500).send('Error downloading video');
    }
});

module.exports.handler = serverless(app);
