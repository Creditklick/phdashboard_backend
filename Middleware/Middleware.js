const authMiddleware = async(req , res , next)=>{
     const token = req.cookies.session_token;
  if (!token) return res.status(401).json({ success: false, message: 'No session' });

  const [sessions] = await Pool.promise().query('SELECT * FROM Sessions WHERE session_token = ? AND is_active = TRUE', [token]);
  if (sessions.length === 0) return res.status(403).json({ success: false, message: 'Session invalid or expired' });

  req.user = sessions[0];
  next();
}


module.exports = {authMiddleware};