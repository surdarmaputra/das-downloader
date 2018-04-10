const fs = require('fs')
const https = require('follow-redirects').https

const videoUrlsFile = 'video-urls.json'
const downloadedVideoUrlsFile = 'downloaded-video-urls.json'

const isFileReadable = (file) => {
	return new Promise((resolve, reject) => {
		fs.open(file, 'r', (err) => {
			if (err) {
				if (err.code === 'ENOENT') resolve(false)
				reject(err)
			} else {
				resolve(true)
			}
		})
	})
}

const getVideoUrls = (file) => {
	return new Promise(async (resolve, reject) => {
		const readable = await isFileReadable(file)
		if (readable) {
			fs.readFile(file, (err, data) => {
				if (err) reject(err)
				if (typeof data !== 'undefined')
					resolve(JSON.parse(data))
				else 
					resolve([])
			})
		} else {
			resolve([])
		}
	})
}

const downloadVideo = (url, targetFile) => {
	console.log(url)
	return new Promise((resolve, reject) => {
		try {
			const stream = fs.createWriteStream(targetFile)
			stream.on('finish', () => {
				resolve(true)
			})
			https.get(url, (res) => {
					res.pipe(stream)
			})
		} 
		catch (err) {
			reject(err)
		}
	})
}

const saveDownloadedVideo = (downloadedVideoUrls, targetFile) => {
	return new Promise((resolve, reject) => {
		fs.writeFile(targetFile, JSON.stringify(downloadedVideoUrls), err => {
			if (err) reject(err)
			console.log('Downloaded list updated.')
			resolve()
		})
	})
}

;(async () => {
	const videoUrls = await getVideoUrls(videoUrlsFile)
	const downloadedVideoUrls = await(getVideoUrls(downloadedVideoUrlsFile))
	const videoCount = videoUrls.length
	const titleRegex = /catalog(.*)download/
	let url
	let title
	let targetFile
	let status
	for (let i = 0; i < videoCount; i++) {
		url = videoUrls[i]
		title = (videoUrls[i].match(titleRegex)[0]).replace(/(catalog\/)|(\/download)/g, '')
		targetFile = `${ title }.mp4`
		console.log(`Downloading ${ title }...`)
		if (downloadedVideoUrls.includes(url)) {
			console.log('Video already downloaded.')
		} else {
			status = await downloadVideo(url, targetFile)
			if (status) {
				console.log(targetFile, 'download completed.')
				downloadedVideoUrls.push(url)
				await saveDownloadedVideo(downloadedVideoUrls, downloadedVideoUrlsFile)
			} else {
				console.log(targetFile, 'download failed.')
			}
		}
	}
})()

