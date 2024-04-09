import { Response } from "express";

import IRequest from "../types/request";

import SpamService from '../services/spamService';

const spamContact = async (req: IRequest, res: Response) => {
  try {
    const { phone } = req.params;
    if (!phone) {
      return res.status(400).json({ message: 'Contact not provided to spam' });
    }
    if (!req.isAuth) {
      return res.status(500).json({ message: 'You have to be logged in to add a spam' });
    }
    var spamArgs = { userId: req.context.user.id, phone};
    console.log('spamArs: ', spamArgs, typeof spamArgs.phone ,typeof spamArgs.userId)
    const existingSpam = await SpamService.findbyUserId(spamArgs, req);
    if (existingSpam.length) {
      return res.status(500).json({ message: 'Spam has already been added. Try with another phone number.' });
    }

    await SpamService.mark(spamArgs, req)

    res.status(201).json({ message: 'Contact spam successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const unspamContact = async (req: IRequest, res: Response) => {
  try {
    const { phone } = req.params;
    if (!phone) {
      return res.status(400).json({ message: 'Contact not provided to remove spam' });
    }
    if (!req.isAuth) {
      return res.status(500).json({ message: 'You have to be logged in to remove a spam' });
    }
    var spamArgs = { userId: req.context.user.id, phone};
    const existingSpam = await SpamService.findbyUserId(spamArgs, req);
    if (!existingSpam.length) {
      return res.status(404).json({ message: 'No spam found. Try with a contact where spam is added.' });
    }

    await SpamService.remove(spamArgs, req);
    res.json({ message: 'Contact unspammed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserSpams = async (req: IRequest, res: Response) => {
  try {
    const { phone } = req.params;
    if (!phone) {
      return res.status(400).json({ message: 'Contact not provided to remove spam' });
    }
    var spamArgs = { phone };
    const existingSpams = await SpamService.find(spamArgs, req);
    res.status(200).json({ spams: existingSpams });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export default {
  spamContact,
  unspamContact,
  getUserSpams,
}