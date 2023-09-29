import jwt from "jsonwebtoken";

//next: Belirtec geçerli olduğunda isteği işlemeye devam etmek için çağrılan işlev
//verifyToken() Ara katman yazılımı işlevini kullanarak, yalnızca kimliği doğrulanmış kullanıcıların korunan rotalarınıza erişebilmesini sağlayabilirsiniz.

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization") 
    //HTTP istek nesnesinden belirtilen başlığın'Authorization' değerini döndürür. değişkende değeri saklar
    //Authorization: istemcinin sunucuya kimliğini doğrulamak için kullanılır

    if(!token) {
      return  res.status(403).send("Access Denied")
    }
    
    if(token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft()
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET)
    req.user = verified
    next()

  } catch (err) {
    res.status(500).json({error: err.message}) //500 Dahili Sunucu Hatası 
  }
}