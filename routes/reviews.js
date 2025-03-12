const express = require('express');
const router = express.Router({mergeParams : true});

const ExpressError = require('../utils/ExpressErrors.js');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const Review = require('../models/review');

const { reviewSchema } = require('../schemas.js');

const validateReview = (req, res, next) =>{
    const {error} = reviewSchema.validate(req.body);
    if (error) { 
         throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async(req, res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', '성공적으로 새로운 리뷰 생성!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:reviewId', catchAsync(async(req, res)=>{
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', '성공적으로 리뷰를 지웠습니다!');
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;