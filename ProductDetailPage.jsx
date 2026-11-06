import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Plus,
  Minus,
  MessageSquare,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { productsApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Review submission state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const fetchProduct = async () => {
    try {
      const res = await productsApi.getProductById(id);
      setProduct(res.data);
      setSelectedImage(res.data.image);
    } catch (err) {
      console.error('Failed to load product:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.countInStock <= 0) return;
    addToCart(product, quantity);
    addToast(`Added ${quantity} × "${product.name.slice(0, 24)}..." to cart`, 'success');
  };

  const handleBuyNow = () => {
    if (!product || product.countInStock <= 0) return;
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setReviewError('Please write your review thoughts');
      return;
    }
    setReviewLoading(true);
    setReviewError('');
    try {
      await productsApi.addReview(product.id, { rating, comment });
      addToast('Review submitted successfully!', 'success');
      setComment('');
      fetchProduct(); // reload reviews
    } catch (err) {
      setReviewError(err.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <h2 className="text-xl font-bold text-slate-800">Product not found</h2>
        <Link to="/products" className="mt-4 inline-block text-xs font-bold text-blue-600 hover:underline">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.countInStock <= 0;
  const isLowStock = product.countInStock > 0 && product.countInStock <= 5;
  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/products" className="hover:text-blue-600">Products</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex items-center justify-center p-4">
            <img
              src={selectedImage || product.image}
              alt={product.name}
              className="w-full h-full object-contain object-center hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Thumbnail list */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl bg-white border-2 p-1 overflow-hidden shrink-0 transition-all ${
                    selectedImage === img ? 'border-blue-600 ring-2 ring-blue-100 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info & Buy Box */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
              <span>{product.category}</span>
              {product.brand && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">{product.brand}</span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Rating Bar */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-amber-400 stroke-amber-500'
                        : 'fill-slate-100 stroke-slate-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-800">{product.rating}</span>
              <span className="text-xs text-slate-400">({product.numReviews} customer reviews)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-baseline gap-3">
            <span className="text-3xl font-black text-slate-900">${product.price.toFixed(2)}</span>
            {product.compareAtPrice && (
              <>
                <span className="text-sm text-slate-400 line-through">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
                <span className="text-xs font-bold text-rose-600 bg-rose-100/80 px-2 py-0.5 rounded-full">
                  Save {discountPercent}%
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>

          {/* Stock Availability */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Availability:</span>
            {isOutOfStock ? (
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full animate-pulse">
                Low Stock — Only {product.countInStock} Left!
              </span>
            ) : (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> In Stock ({product.countInStock} units ready to ship)
              </span>
            )}
          </div>

          {/* Quantity Controls & Action Buttons */}
          <div className="pt-4 border-t border-slate-200/80 space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700">Quantity</span>
              <div className="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden shadow-xs">
                <button
                  type="button"
                  disabled={quantity <= 1 || isOutOfStock}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2.5 hover:bg-slate-50 text-slate-600 disabled:opacity-30"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-12 text-center text-sm font-bold text-slate-900">{quantity}</span>
                <button
                  type="button"
                  disabled={quantity >= product.countInStock || isOutOfStock}
                  onClick={() => setQuantity((q) => Math.min(product.countInStock, q + 1))}
                  className="p-2.5 hover:bg-slate-50 text-slate-600 disabled:opacity-30"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Reassurance Tiles */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200/80 text-center">
            <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-xs">
              <Truck className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-slate-800">Fast Express</div>
              <div className="text-[10px] text-slate-400">Tracked delivery</div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-xs">
              <RotateCcw className="w-4 h-4 text-amber-600 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-slate-800">30-Day Return</div>
              <div className="text-[10px] text-slate-400">Easy refunds</div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-slate-800">2-Year Warranty</div>
              <div className="text-[10px] text-slate-400">Certified quality</div>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      {product.specs && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Technical Specifications</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {typeof product.specs === 'object' ? (
              Object.entries(product.specs).map(([key, val]) => (
                <div key={key} className="flex justify-between py-2.5 px-4 bg-slate-50 rounded-xl text-xs">
                  <span className="font-bold text-slate-500">{key}</span>
                  <span className="font-semibold text-slate-800 text-right">{val}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-600 col-span-2">{product.specs}</p>
            )}
          </div>
        </div>
      )}

      {/* Customer Reviews Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Verified Customer Reviews</h3>
            <p className="text-xs text-slate-500 mt-1">
              Real feedback from verified purchasers of this item
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-3xl font-black text-slate-900">{product.rating}</div>
            <div>
              <div className="flex text-amber-500">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
                ))}
              </div>
              <span className="text-[11px] text-slate-400">Based on {product.numReviews} ratings</span>
            </div>
          </div>
        </div>

        {/* Existing Reviews List */}
        <div className="space-y-4">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                      {rev.userName[0]}
                    </div>
                    <span className="text-xs font-bold text-slate-800">{rev.userName}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex text-amber-500">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? 'fill-amber-400 stroke-amber-500' : 'fill-slate-200 stroke-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 text-center py-4">No reviews yet for this product. Be the first to share your experience!</p>
          )}
        </div>

        {/* Write a review form */}
        <div className="pt-6 border-t border-slate-100">
          <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            Write a Review
          </h4>

          {user ? (
            <form onSubmit={handleReviewSubmit} className="space-y-4 max-w-xl">
              {reviewError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{reviewError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Your Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? 'fill-amber-400 stroke-amber-500'
                            : 'fill-slate-100 stroke-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">{rating} Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Your Review Comment
                </label>
                <textarea
                  rows="3"
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details of your experience with build quality, battery life, design..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={reviewLoading}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all disabled:opacity-50"
              >
                {reviewLoading ? 'Submitting...' : 'Post Review'}
              </button>
            </form>
          ) : (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600">
              Please{' '}
              <Link to={`/login?redirect=/products/${product.id}`} className="font-bold text-blue-600 hover:underline">
                Sign In
              </Link>{' '}
              to submit a verified customer review.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

