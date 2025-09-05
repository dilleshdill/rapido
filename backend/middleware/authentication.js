import jwt from "jsonwebtoken";
const authenticate = (req,res,next) =>{
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
        console.log('No token found');
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    try {
        const decoded = jwt.verify(token,"rapido");
        if (decoded){
            req.user = decoded; 
            next(); 
        }
    } 
    catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}
export default authenticate;