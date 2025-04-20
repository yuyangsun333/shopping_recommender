import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pickle
import numpy as np
import scipy.sparse as sp

df = pd.read_csv('data/final_recommendation_data.csv')

tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(df['product_name'])


with open('backend/models/tfidf_vectorizer.pkl', 'wb') as f:
    pickle.dump(tfidf, f)

sp.save_npz('backend/models/tfidf_matrix.npz', tfidf_matrix)

print("Saved TF-IDF model and matrix")


user_item = df.groupby(['user_id', 'product_name']).size().unstack(fill_value=0)
user_item_sparse = sp.csr_matrix(user_item.values)

sp.save_npz('backend/models/user_item_matrix.npz', user_item_sparse)
with open('backend/models/user_item_columns.pkl', 'wb') as f:
    pickle.dump(user_item.columns.tolist(), f)

print("Saved User-Item matrix")
