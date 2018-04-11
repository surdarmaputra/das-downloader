const fs = require('fs')
const path = require('path')

const groupsFile = 'groups.json'

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

const isDir = (path) => {
	return new Promise((resolve, reject) => {
		fs.stat(path, (err, stats) => {
			if (err) {
				if (err.code === 'ENOENT') resolve(false)
				reject(err)
			} else {
				if (stats.isDirectory()) resolve(true)
				else resolve(false)
			}
		})
	})
}

const getVideoData = (file) => {
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

const getTargetDir = () => {
	let targetDir = path.resolve(__dirname)
	process.argv.forEach((val, index) => {
		if (val.includes('--targetDir=')) {
			targetDir = val.split('=')[1]
		}
	})
	return targetDir
}

const createDir = (path) => {
	return new Promise((resolve, reject) => {
		fs.mkdir(path, (err) => {
			if (err) {
				if (err.code === 'EEXIST') resolve()
				reject(err)
			}
			resolve()
		})
	})
}

const rename = (oldPath, newPath) => {
	return new Promise((resolve, reject) => {
		fs.rename(oldPath, newPath, (err) => {
			if (err) {
				if (err.code === 'ENOENT') resolve(false)
				reject(err)
			}
			resolve(true)
		})
	})
}

;(async () => {
	const targetDir = getTargetDir()
	const videoData = await getVideoData(groupsFile)
	console.log('Checking status of ', targetDir)
	const validDir = await isDir(targetDir)
	if (validDir) {
		const rootDir = path.resolve(targetDir, 'DAS')
		console.log('Creating DAS directory...')
		await createDir(rootDir)
		videoData.forEach(async (item) => {
			const seasonDir = path.resolve(rootDir, item.seasonTitle)
			console.log(`Creating ${ item.seasonTitle } directory...`)
			await createDir(seasonDir)
			item.episodes.forEach(async (episode) => {
				const oldFile = path.resolve(targetDir, episode.file)
				const newFile = path.resolve(seasonDir, episode.expectedFile)
				const renameResult = await rename(oldFile, newFile)
				if (renameResult) console.log(episode.file, 'moved.')
				else console.log(episode.file, 'not found. Skipping.')
			})
		})
	} else {
		console.log(targetDir, 'is not a valid directory. Aborting.')
	}
})()

