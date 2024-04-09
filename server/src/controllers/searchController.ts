import { Response } from 'express';

import IRequest from '../types/request';

import SearchService from '../services/searchService';

async function searchByName(req: IRequest, res: Response) {
    try {
        const { query } = req.params;
        if (!query) {
            return res.status(400).json({ message: 'Query not provided to search' });
        }
        var searchResult = await SearchService.searhContactByName({query}, req)
        res.status(200).json(searchResult);
    } catch (error) {
        console.error('Error searching by name:', error);
        res.status(500).json({ error: 'An error occurred while searching by name.' });
    }
}

async function searchByPhoneNumber(req: IRequest, res: Response) {
    try {
        const { phone } = req.params;
        if (!phone) {
            return res.status(400).json({ message: 'Phone not provided to search' });
        }
        var searchResult = await SearchService.searchContactByPhone({phone}, req)
        res.json(searchResult);
    } catch (error) {
        console.error('Error searching by phone number:', error);
        res.status(500).json({ error: 'An error occurred while searching by phone number.' });
    }
}

async function searchByIdAndSource(req: IRequest, res: Response) {
    try {
        const { id, source } = req.params;
        if (!id || !source) {
            return res.status(400).json({ message: 'Id and Source not provided to search' });
        }
        var searchResult = await SearchService.searchContactByIdAndSource({id, source, userId: req.context.user.id}, req);
        res.json(searchResult);
    } catch (error) {
        console.error('Error searching by phone number:', error);
        res.status(500).json({ error: 'An error occurred while searching by id and source.' });
    }
}

export default { 
    searchByName,
    searchByPhoneNumber,
    searchByIdAndSource
};