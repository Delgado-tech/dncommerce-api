import express, { Request, Response } from 'express';
import db from '../services/db';
import mysql from 'mysql2';
import { errorHandler } from '../handlers/errorHandler';

const router = express.Router();

router.get('/products', async (req: Request, res: Response) => {
    try {
        const result = await db.query(`SELECT * FROM ${db.tableName.products};`);
        res.json(200).json({
            data: result
        });

    } catch (error) {
        await errorHandler(res, String(error));
    }
});

router.get('/products/:id', async (req: Request, res: Response) => {
    try {
        const userId: any = req.params.id;
        if (isNaN(userId)) {
            throw new Error("customError: Invalid Id!");
        }

        const result = await db.query(`SELECT * FROM ${db.tableName.products} WHERE id = ${userId} LIMIT 1;`);
        res.json(200).json({
            data: result
        });

    } catch (error) {
        await errorHandler(res, String(error));
    }
});

export default router;