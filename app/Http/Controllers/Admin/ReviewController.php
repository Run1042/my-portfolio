<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index()
    {
        $reviews = Review::orderBy('sort_order')->orderBy('created_at', 'desc')->paginate(20);
        return view('admin.reviews.index', compact('reviews'));
    }

    public function create()
    {
        return view('admin.reviews.create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'         => 'required|string|max:100',
            'role'         => 'nullable|string|max:100',
            'rating'       => 'required|integer|min:1|max:5',
            'message'      => 'required|string|max:1000',
            'is_published' => 'nullable|boolean',
            'sort_order'   => 'nullable|integer',
        ]);

        $data['is_published'] = $request->boolean('is_published', true);
        $data['sort_order']   = $data['sort_order'] ?? 0;

        Review::create($data);

        return redirect()->route('admin.reviews.index')->with('success', 'Review added successfully.');
    }

    public function edit(Review $review)
    {
        return view('admin.reviews.edit', compact('review'));
    }

    public function update(Request $request, Review $review)
    {
        $data = $request->validate([
            'name'         => 'required|string|max:100',
            'role'         => 'nullable|string|max:100',
            'rating'       => 'required|integer|min:1|max:5',
            'message'      => 'required|string|max:1000',
            'is_published' => 'nullable|boolean',
            'sort_order'   => 'nullable|integer',
        ]);

        $data['is_published'] = $request->boolean('is_published', true);
        $data['sort_order']   = $data['sort_order'] ?? 0;

        $review->update($data);

        return redirect()->route('admin.reviews.index')->with('success', 'Review updated successfully.');
    }

    public function destroy(Review $review)
    {
        $review->delete();
        return redirect()->route('admin.reviews.index')->with('success', 'Review deleted.');
    }

    public function togglePublish(Review $review)
    {
        $review->update(['is_published' => !$review->is_published]);
        return back()->with('success', 'Review status updated.');
    }
}
