<?php

namespace App\Http\Controllers\Admin;

use App\Exports\ProductsExport;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class ProductController extends Controller
{
    /**
     * Display a listing of the products.
     */
    public function index(Request $request): Response
    {
        $products = Product::with(['category', 'images'])->latest()->paginate(10);
        $categories = Category::withCount('products')->orderBy('name')->get();

        return Inertia::render('admin/products/index', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created product.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'is_active' => 'boolean',
            'images' => 'nullable|array',
            'images.*' => 'image|max:2048', // max 2MB per image
        ]);

        $validated['slug'] = Str::slug($validated['name']).'-'.time();
        $validated['is_active'] = $request->boolean('is_active');

        // We don't save thumbnail directly from request anymore
        // It will be set from the first uploaded image
        $product = Product::create($validated);

        if ($request->hasFile('images')) {
            $firstPath = null;
            foreach ($request->file('images') as $index => $file) {
                $path = $file->store('products', 'public');

                ProductImage::create([
                    'product_id' => $product->id,
                    'path' => $path,
                    'sort_order' => $index,
                ]);

                if ($index === 0) {
                    $firstPath = $path;
                }
            }

            // Set first image as thumbnail
            if ($firstPath) {
                $product->update(['thumbnail' => $firstPath]);
            }
        }

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Produk berhasil ditambahkan.',
        ]);
    }

    /**
     * Update the specified product.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'is_active' => 'boolean',
            'images' => 'nullable|array',
            'images.*' => 'image|max:2048', // max 2MB per image
        ]);

        $validated['slug'] = Str::slug($validated['name']).'-'.time();
        $validated['is_active'] = $request->boolean('is_active');

        $product->update($validated);

        if ($request->hasFile('images')) {
            $maxSortOrder = $product->images()->max('sort_order') ?? -1;
            $firstPath = null;

            foreach ($request->file('images') as $index => $file) {
                $path = $file->store('products', 'public');

                ProductImage::create([
                    'product_id' => $product->id,
                    'path' => $path,
                    'sort_order' => $maxSortOrder + 1 + $index,
                ]);

                if ($index === 0 && ! $product->thumbnail) {
                    $firstPath = $path;
                }
            }

            if ($firstPath) {
                $product->update(['thumbnail' => $firstPath]);
            }
        }

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Data produk berhasil diperbarui.',
        ]);
    }

    /**
     * Remove the specified product.
     */
    public function destroy(Product $product)
    {
        // Delete all related images from storage
        foreach ($product->images as $image) {
            if (Storage::disk('public')->exists($image->path)) {
                Storage::disk('public')->delete($image->path);
            }
        }

        // Also delete thumbnail if it's somehow not in the images table
        if ($product->thumbnail && Storage::disk('public')->exists($product->thumbnail)) {
            Storage::disk('public')->delete($product->thumbnail);
        }

        $product->delete();

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Produk berhasil dihapus.',
        ]);
    }

    /**
     * Export products to PDF or Excel.
     */
    public function export($format)
    {
        if ($format === 'excel') {
            return Excel::download(new ProductsExport, 'products.xlsx');
        }

        if ($format === 'pdf') {
            $products = Product::with('category')->latest()->get();
            $pdf = Pdf::loadView('exports.products', compact('products'));

            return $pdf->stream('products.pdf');
        }

        abort(404);
    }

    /**
     * Delete a specific product image.
     */
    public function destroyImage(ProductImage $image)
    {
        $product = $image->product;

        if (Storage::disk('public')->exists($image->path)) {
            Storage::disk('public')->delete($image->path);
        }

        // If this image was the primary thumbnail, unset it
        if ($product->thumbnail === $image->path) {
            $product->update(['thumbnail' => null]);
        }

        $image->delete();

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Gambar berhasil dihapus.',
        ]);
    }

    /**
     * Set a specific image as the primary thumbnail.
     */
    public function setPrimaryImage(Product $product, Request $request)
    {
        $request->validate([
            'image_id' => 'required|exists:product_images,id',
        ]);

        $image = ProductImage::findOrFail((int) $request->input('image_id'));

        // Ensure the image belongs to this product
        if ($image->product_id !== $product->id) {
            abort(403);
        }

        $product->update(['thumbnail' => $image->path]);

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Gambar utama berhasil diubah.',
        ]);
    }
}
