const puppeteer = require('puppeteer')
const fs = require('fs')

const url = 'https://www.destroyallsoftware.com/screencasts/catalog'
const targetFile = 'groups.json'

;(async () => {
	const browser = await puppeteer.launch()
	const page = await browser.newPage()
	await page.goto(url, { timeout: 0, waitUntil: 'networkidle2' })

	const links = await page.evaluate(gatherCatalog)
	fs.writeFile(targetFile, JSON.stringify(links), err => {
		if (err) throw err
		console.log('List saved.')
	})
	await browser.close()
})()


const gatherCatalog = () => {
	const links = []
	const catalog = document.querySelectorAll('.container.season')
	catalog.forEach(season => {
		const titleWrapper = season.querySelector('h1.season_title')
		const seasonTitle = titleWrapper.querySelector('img').alt
		const episodes = []
		season.querySelectorAll('.episode').forEach(episode => {
			const link = episode.querySelector('a').href
			const sequence = episode.querySelector('a > .row > .number').textContent
			const title = link.replace('https://www.destroyallsoftware.com/screencasts/catalog/', '')
			episodes.push({
				sequence,
				title,
				link,
				file: `${ title }.mp4`,
				expectedFile: `${ sequence }_${ title }.mp4`
			})
		})
		links.push({
			seasonTitle,
			episodes
		})
	})
	return links
}
