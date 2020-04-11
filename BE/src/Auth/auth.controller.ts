export async function getUserByToken(req, res, next) {
    res.status(200).json(req.user);
}