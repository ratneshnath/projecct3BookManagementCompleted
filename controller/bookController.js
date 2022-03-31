const bookModel = require('../model/bookModel');
const jwt = require('jsonwebtoken');
const userModel = require('../model/userModel');
const reviewModel = require('../model/reviewModel');
const ObjectId = require ('mongoose').Types.ObjectId;
const {moment} = require ('moment');
//const { get } = require('../route/route');
const isValid = function (value){
    if(typeof value == 'undefined' || value === null)
     return false
    if(typeof value == 'string' && value.trim().length ===0) 
    return false
    else{
    return true
}}

const createBook = async function (req,res){
try{

    const data = req.body;
    
    
    const {excerpt,userId, ISBN, category,subcategory,releasedAt,title} = data// destructuring
    // if (userId != req.userId) {
    //     return res.status(403).send({status: false, message: "Unauthorized access ! User's credentials doesn't match."})
    // };

    let newUser = await userModel.find({userId})
    if(!newUser){
        return res.status(400).send({status: false, msg: 'no such user present, please check userId'})
    }
    
    if(!excerpt){
        return res.status(400).send({status: false, msg: 'please provide an excerpt'})
    }
    
    if(!ISBN){
        return res.status(400).send({status: false, msg: 'please provide a valid ISBN'})
    }
    const isISBNAllreadyUsed = await bookModel.findOne({ISBN})
    if(isISBNAllreadyUsed){
        return res.status(400).send({status: false, msg: 'ISBN is already used'})  
    }
    if(!category){
        return res.status(400).send({status: false, msg: 'please provide a category'})
    }
    if(!subcategory){
        return res.status(400).send({status: false, msg: 'please provide subcategory as well'})
    }
    if(!releasedAt){
        return res.status(400).send({status: false, msg: 'releasedAt is required'})   
    }
    if(!title){
        return res.status(400).send({status: false, msg: 'title is required'})
    }
    const titleAlreadyUsed = await bookModel.findOne({title})
    if(titleAlreadyUsed){
        return res.status(400).send({status: false,msg: 'title already used'})
    }

    const createdBooks = await bookModel.create(data)
    return res.status(201).send({status: true, data: createdBooks})
}
catch (err){
    console.log(err.message)
    res.status(500).send({msg: "error",error: err.message })
}

}

//GetAllBooks
const getAllBooks = async function (req, res) {
    try {
        const queryParams = req.query
        const filterConditions = { isDeleted: false }
        

        if (isValid(queryParams)) {
            const { userId, category, subcategory } = queryParams

        // const check = await bookModel.findOne(queryParams)
        // if (check) {
        // if (check.userId != req.userId) {
        // return res.status(401).send({status: false,message: "Unauthorized access."})}}

            
            if (isValid(userId) && !isValid(userId)) {
                if (!isValid(userId)) {
                    return res.status(400).send({ status: false, msg: "Invalid userId" })
                }
                const userById = await userModel.findById(userId)
                
                if (userById) {
                    filterConditions['userId'] = userId
                }
            }

            if (isValid(category)) {
                filterConditions['category'] = category.trim()
            }

            if (isValid(subcategory)) {
                filterConditions['subcategory'] = subcategory.trim()
            }
            const bookListAfterFiltration = await bookModel.find(filterConditions).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })
            .sort({ title: 1});

            const countBooks = bookListAfterFiltration.length

            if (bookListAfterFiltration.length == 0) {
                return res.status(404).send({ status: false, message: "No books found" })
            }

            res.status(200).send({ status: true, message: `${countBooks} books found.`, bookList: bookListAfterFiltration })

        } else {
            const bookList = await bookModel.find(filterConditions).select({ _id: 0, title: 0, excerpt: 0, userId: 0, category: 0, releasedAt: 0, reviews: 0 })
            .sort({ title: 1});

            if (bookList.length == 0) {
                return res.status(404).send({ status: false, message: "No books found" })
            }

            res.status(200).send({ status: true, message: "Book list is here", bookList: bookList })
        }
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }
};

// const getBookById = async function(req,res){
//     try{
//        const bookParams = req.params.bookId

//        //validating bookId after accessing it from the params.
//        if (!isValid(bookParams)) {
//            return res.status(400).send({ status: false, message: "Inavlid bookId." })
//        }

//        //Finding the book in DB by its Id & an attribute isDeleted:false
//        const findBook = await bookModel.findOne({_id: bookParams,isDeleted: false })
//        if (!findBook) {
//            return res.status(404).send({ status: false, message: `Book does not exist or is already been deleted for this ${bookParams}.` })
//        }

//        //Checking the authorization of the user -> Whether user's Id matches with the book creater's Id or not.
//        if (findBook.userId != req.userId) {
//            return res.status(401).send({status: false, message: "Unauthorized access."})
//        }

//        //Accessing the reviews of the specific book which we got above, -> In reviewsData key sending the reviews details of that book.
//        const fetchReviewsData = await reviewModel.find({ bookId: bookParams, isDeleted: false }).select({ deletedAt: 0, isDeleted: 0, createdAt: 0, __v: 0, updatedAt: 0 }).sort({reviewedBy: 1})

//        let reviewObj = findBook.toObject()
//        if (fetchReviewsData) {
//            reviewObj['reviewsData'] = fetchReviewsData
//        }

//        return res.status(200).send({ status: true, message: "Book found Successfully.", data: reviewObj })
//     }catch(err){
//        return res.status(500).send({status:false,msg: err.message})

//    }
// }

const getBookById = async function (req, res) {
    try {
        let bookId = req.params.bookId

        if (!isValid(bookId.trim())) {
            return res.status(400).send({ status: false, msg: "bookId required" })

        }
        let reviewList = await bookModel.findOne({ bookId: bookId })
        if (!reviewList) {
            return res.status(404).send({ status: false, msg: "not found " })
        }
        if (!ObjectId.isValid(bookId)) {
            return res.status(400).send({ status: false, msg: "bookId invalid" })
        }
        let result = {
            _id: reviewList._id,
            title: reviewList.title,
            excerpt: reviewList.excerpt,
            userId: reviewList.userId,
            category: reviewList.category,
            subcategory: reviewList.subcategory,
            deleted: reviewList.isDeleted,
            reviews: reviewList.reviews,
            deletedAt: reviewList.deletedAt,
            releasedAt: reviewList.releasedAt,
            createdAt: reviewList.createdAt,
            updatedAt: reviewList.updatedAt
        }
        let eachReview = await reviewModel.find({ bookId: bookId }).select({ bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })
        if (!eachReview) {
            result['reviewsData'] = "No review for this books"
            return res.status(200).send({ status: false, data: result })
        }
        result['reviewsData'] = eachReview
        return res.status(200).send({ status: false, data: result })



    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }


}

const updateBook = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let { title, excerpt, releasedAt, ISBN } = req.body
        // if (userId != req.userId) {
        //     return res.status(403).send({status: false, message: 'Unauthorized access'})
        // };
        if (!(title || excerpt || releasedAt || ISBN)) {
            return res.status(400).send({ status: false, msg: "required data should be title ,excerpt,date ,ISBN" })
        }
        let dupBook = await bookModel.findOne({ title: title, ISBN: ISBN })
        if (dupBook) {
            return res.status(400).send({ status: false, msg: "this title and ISBN already updated" })
        }
        if (!bookId) {
            return res.status(400).send({ status: false, msg: "bookId is required" })
        }
        if (!ObjectId.isValid(bookId.trim())) {
            return res.status(400).send({ status: false, msg: "invalid bookId" })
        }
        if (!/((\d{4}[\/-])(\d{2}[\/-])(\d{2}))/.test(releasedAt)) {
            return res.status(400).send({ status: false, msg: "this data format /YYYY-MM-DD/ accepted " })

        }
        let updateBookData = { title: title, excerpt: excerpt, releasedAt: releasedAt, ISBN: ISBN }
        let updated = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $set: updateBookData }, { new: true })
        if (!updated) {
            return res.status(404).send({ status: false, msg: "data not found " })
        }
        return res.status(200).send({ status: true, data: updated })
        
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

const deleteByBookId = async function (req, res) {
    try {
        const params = req.params.bookId; //accessing the bookId from the params.

        //validation for the invalid params.
        // if (!isValidObjectId(params)) {
        //     return res.status(400).send({ status: false, message: "Inavlid bookId." })
        // }
        if (!(/^[0-9a-fA-F]{24}$/.test(params))) {
            res.status(400).send({ status: false, message: 'please provide valid bookId' })
            return
        }

        //finding the book in DB which the user wants to delete.
        const findBook = await bookModel.findById({ _id: params })

        if (!findBook) {
            return res.status(404).send({ status: false, message: 'No book found by params' })
        }
        //Authorizing the user
        else if (findBook.userId != req.userId) {
            return res.status(401).send({ status: false, message: "Unauthorized access."})
        }
        //if the attribute isDeleted:true , then it is already deleted.
        else if (findBook.isDeleted == true) {
            return res.status(400).send({ status: false, message: `Book has been already deleted.` })
        } else {
            //if attribute isDeleted:false, then change the isDeleted flag to true, and remove all the reviews of the book as well.
            const deleteData = await bookModel.findOneAndUpdate({ _id: { $in: findBook } }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true }).select({ _id: 1, title: 1, isDeleted: 1, deletedAt: 1 })
            
            await reviewModel.updateMany({ bookId: params }, { isDeleted: true, deletedAt: new Date() })
            return res.status(200).send({ status: true, message: "Book deleted successfullly.", data: deleteData })
        }
    } catch (err) {
        return res.status(500).send({ status: false, Error: err.message })
    }}

module.exports.createBook = createBook
module.exports.getAllBooks = getAllBooks
module.exports.getBookById = getBookById
module.exports.updateBook = updateBook
module.exports.deleteByBookId = deleteByBookId