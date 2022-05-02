import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;
    //Checking token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(" ")[1]
    }
    if (!token) {
        return res.status(401).json({ success: false, error: 'Not authorized to acces this route' })
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decode.id);

        if (!user) {
            res.status(404).json({ success: false, error: 'No user found this id' })
        }
        req.user = user
        next();

    } catch (error) {
        return res.status(401).json({ success: false, error: 'Not authorized to acces this route' })
    }

}
