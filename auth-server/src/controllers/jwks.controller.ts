import { Request, Response } from 'express';
import { jwk } from '../config/keys';

export const getJwks = (req: Request, res: Response) => {
    res.set('Cache-Control', 'public, max-age=300');
    res.json({ keys: [jwk] });
};