// pages/api/data.ts
import {join} from 'path'
import fs from 'fs'
import {NextApiRequest, NextApiResponse} from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {currency} = req.query
    const csvFilePath = join(process.cwd(), 'src', 'data', 'prices', `${currency}.csv`)

    try {
        const csvFile = fs.readFileSync(csvFilePath, 'utf-8')
        res.status(200).send(csvFile)
    } catch (error) {
        console.error(error) // Log the error to your server console
        res.status(500).json({error: 'An error occurred while reading the CSV file.'})
    }
}

export default handler
