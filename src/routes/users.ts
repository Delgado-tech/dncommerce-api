import express, { Request, Response } from 'express';
import db from '../services/db';
import mysql from 'mysql2';
import validator from 'validator';
import { TransformType, textTransform } from 'text-transform';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import bcrypt from 'bcrypt';

const router = express.Router();

router.get('/users', async (req: Request, res: Response) => {
    try {
        const result = await db.query(`SELECT * FROM ${db.tableName.users};`)
        res.status(200).json({
            data: result
        });
    } catch (error) {
        res.status(400).json({
            message: "Something went Wrong!"
        });
    }
});

router.get('/users/:id', async (req: Request, res: Response) => {
    try {
        const userId: any = req.params.id;

        if (isNaN(userId)) {
            throw new Error("Invalid Id");
        }

        const result = await db.query(`SELECT * FROM ${db.tableName.users} WHERE id = ${userId} LIMIT 1;`);
        res.status(200).json({
            data: result
        });

    } catch (error) {
        res.status(400).json({
            message: String(error)
        });
    }

});

router.post('/users', async (req: Request, res: Response) => {
    try {
        const { name, cpf, email, pass, gender, access_level } = req.body;

        let tr_name = textTransform(name, TransformType.title).trim();

        let tr_cpf = String(cpf).replace(/\D/g, '');
        if(!cpfValidator.isValid(tr_cpf)) {
            throw new Error("Invalid Cpf!");
        }
        tr_cpf = cpfValidator.format(tr_cpf);

        let tr_email = String(email).toLowerCase();
        if (!validator.isEmail(tr_email)) {
            throw new Error("Invalid Email!");
        }

        if (String(pass).length > 32 ||  String(pass).length < 8) {
            throw new Error("Invalid Password! The password must contain a minimum of 8 characters and a maximum of 32");
        }
        const tr_pass = bcrypt.hashSync(pass, 10);

        let tr_gender: string | null = String(gender).toUpperCase();
        if (tr_gender !== "M" && tr_gender !== "F") {
            tr_gender = null;
        }

        let tr_access_level = access_level;
        if(access_level < 1 || access_level > 4) {
            tr_access_level = 1;
        }

        const result = await db.query(`INSERT INTO ${db.tableName.users}(name, cpf, email, pass, gender, access_level) 
            values(?, ?, ?, ?, ?, ?)`, [ tr_name, tr_cpf, tr_email, tr_pass, tr_gender, tr_access_level ] ) as mysql.ResultSetHeader;
        
        res.status(200).json({
            message: `User (#${result.insertId}) has been created!`
        });
    } catch (error) {

        if (String(error).includes("Duplicate entry")) {
            if (String(error).includes("users.cpf")) {
                res.status(400).json({
                    message: String("This cpf is already in use!"),
                });

            } else if (String(error).includes("users.email")) {
                res.status(400).json({
                    message: String("This email is already in use!")
                });

            }

            return;
        }

        res.status(400).json({
            message: "Request denied! Check that there are no incorrectly filled values!"
        });
    }
});

export default router;