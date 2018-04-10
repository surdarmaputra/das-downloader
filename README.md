# das-downloader
Destroy All Software video downloader for free screencasts.

Download screencasts from [https://www.destroyallsoftware.com](https://www.destroyallsoftware.com) while its free from April 2nd to April 10th 2018. Big thanks to them for providing these learning materials :bow:.

## linkCollector.js

Collect video links from the catalog.
1. Run `node linkController.js`
2. Wait for the process to be finished
3. List of video links stored in `video-urls.json` file

## videoDownloader.js

Download videos from links provided by `video-urls.json` file.
1. Run `node videoDownloader.js`
2. It'll read the link from `video-urls.json`
3. It'll follow the link redirection to AWS S3 where the video being stored
4. It'll download the video into mp4 file
5. It'll save successfully downloaded url into `downloaded-video-urls.json` file, so if we encounter connection lost, it'll continue to download the rest
