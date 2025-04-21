# Smart Beauty Assistant

Welcome to **Smart Beauty Assistant** — your intelligent guide to discovering beauty products tailored to your skin type, preferences, and needs!

This project compares and implements two different recommendation approaches, using a large real-world dataset to demonstrate the power of both **attribute-based filtering** and **content-based filtering**.

---

## Project Overview

- **Goal**: Build a recommendation system that helps users find beauty products that best fit their needs based on either:
	- Personal attributes (e.g., skin type, price range, brand preference)
	- Textual keyword search (e.g., "cleanser for dry skin")

- **Dataset**:
	- 120,000+ rows of synthetic beauty product data.
	- Fields include `user_id`, `product_id`, `product_name`, `price`, `brand`, `rating`, and `review`.
	- Stored and managed via **Git LFS** for large file support.

- **Algorithms Compared**:
	- **Content-Based Filtering**:
		- TF-IDF (bag-of-words) + cosine similarity based on product names and reviews.
	- **Attribute-Based Filtering**:
		- Matching based on user input (skin type, price range, brand, minimum rating).

---

## Data Structures and Algorithms Used

This project uses non-trivial data structures to meet the course project requirements:

### 1. Hash Tables for Fast Lookup
- All product data is loaded into in-memory JavaScript objects (arrays of product objects).
- Filtering by attributes (skin type, price range, brand, etc.) uses **hash table lookup**.
- JavaScript's native object and array access ( `{}` and `[]` ) achieves **O(1)** average time complexity for lookups.
- This ensures that even with 100,000+ products, filtering remains extremely fast.

### 2. Content-Based Filtering (TF-IDF + Cosine Similarity)
- When users search by keyword, product names and reviews are transformed into **TF-IDF vectors**.
- Cosine similarity between vectors is used to find products that are most similar to the search keyword.
- This method models text similarity efficiently and works well with unstructured review data.

### 3. Attribute-Based Recommendation (Simulated Collaborative Filtering)
- Users can specify skin type, price range, minimum rating, and brand.
- The system finds matching products using attribute-based filtering, similar to collaborative recommendation.

---

## Project Structure

```plaintext
shopping_recommender/
├── backend/
│   ├── recommender/
│   │   ├── contentBased.js        # Content-based recommendation logic
│   │   ├── filterRecommend.js     # Attribute-based filtering logic
│   │   └── index.js               # Exporting modules
│   ├── server.js                  # Express backend API
│
├── frontend/
│   ├── index.html                 # Homepage with intro
│   ├── match.html                 # Find Products That Match Me page
│   ├── keyword.html               # Find Products by Keyword page
│   ├── styles.css                 # Styling
│   └── app.js                     # Frontend logic
│
├── data/
│   └── makeup_recommendation_dataset.csv  # Product dataset (managed by Git LFS)
│
└── README.md
```
---

## Features

- **Find Products by Attributes**
  - Users can select their skin type, set a price range, specify a preferred brand, and minimum rating to get matching products.

- **Find Products by Keyword**
  - Users can enter keywords like "moisturizer for sensitive skin" to find highly relevant products using TF-IDF similarity.

- **Large-Scale Dataset**
  - The system operates on over **120,000 product records**, making the recommendations robust and diverse.

- **Modern Web UI**
  - Responsive, clean, and simple web interface for easy user interaction.

- **Backend API**
  - Built using **Node.js + Express** to handle frontend requests.

## Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Node.js, Express.js
- **Data Handling**: Git LFS for large file support
- **Algorithms**:
  - TF-IDF + Cosine Similarity (Content-Based Filtering)
  - Rule-Based Attribute Filtering (Attribute-Based Filtering)
  - Hash table

---

## How To Run the Project

1. **Clone the Repository**

```bash
git clone https://github.com/yourusername/shopping_recommender.git
cd shopping_recommender
```

2. **Install Backend Dependencies**

```bash
npm install
```

3. **Start the Backend Server**

```bash
npm start
```

The server will start at:

```plaintext
http://localhost:3000/
```

4. **Open Frontend Pages**

Simply open `frontend/index.html` in your browser.

You will see:
- Home page
- Navigation bar to:
	- Find Products That Match Me (Attributes)
	- Find Products by Keyword


## Notes and Important Details:

- The `makeup_recommendation_dataset.csv` file is managed using **Git LFS**.
- GitHub Free Plan allows up to **1 GB** of LFS storage and **1 GB** of monthly bandwidth.

If you clone this repo, make sure you have Git LFS installed:

```bash
brew install git-lfs
git lfs install
```

Otherwise, large files won't download properly.


