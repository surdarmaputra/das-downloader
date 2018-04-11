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

## groupCollector.js

Generate group of episode by season and store this information into `groups.json` file
1. Run `node groupCollector.js`
2. Wait for the process to be finished
3. List of episodes grouped by season stored in `groups.json` file

## videoOrganizer.js

Organize video based on season information store in `groups.json` file
1. Run `node videoOrganizer.js --targetDir=[absolute path of your downloaded video directory]`
2. Wait for the process to be finished
3. All video organized into their corresponding season directory inside `DAS` directory

Final directory should be like this:

```
+- targetDir
---- DAS
------ Season XX
--------- Episode XX1
--------- Episode XX2
--------- ...
------ Season YY
--------- Episode YY1
--------- Episode YY2
--------- ...
------- ...
```

Example: `node videoOrganizer.js --targetDir=/home/me/das-videos`

If `--targetDir` option is not specified, it will assume target directory is the same as script directory.
