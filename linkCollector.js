const puppeteer = require('puppeteer')
const fs = require('fs')

const url = 'https://www.destroyallsoftware.com/screencasts/catalog'

;(async () => {
	const browser = await puppeteer.launch()
	const page = await browser.newPage()
	await page.goto(url, { waitUntil: 'networkidle2' })

	const links = await page.evaluate(gatherCatalog)
	const linkCount = links.length
	let videoUrls = []
	let videoPage
	let videoSource
	for (let i = 0; i < linkCount; i++) {
		videoPage = await browser.newPage()
		await videoPage.goto(links[i], { waitUntil: 'networkidle2' })
		await videoPage.waitForSelector('video > source')
		videoSource = await videoPage.evaluate(getVideoSource)
		console.log('Found:', videoSource)
		await videoPage.close()
		videoUrls.push(videoSource)
	}
	
	fs.writeFile('video-urls.json', JSON.stringify(videoUrls), err => {
		if (err) throw err
		console.log('List saved.')
	})
	await browser.close()
})()


const gatherCatalog = () => {
	const links = []
	const catalog = document.querySelectorAll('.container.season')
	catalog.forEach(season => {
		const episodes = season.querySelectorAll('.episode')
		episodes.forEach(episode => {
			const link = episode.querySelector('a').href
			links.push(link)
		})
	})
	return links
}

const getVideoSource = () => {
	const videoSource = document.querySelector('video > source')
	return videoSource.src
}
