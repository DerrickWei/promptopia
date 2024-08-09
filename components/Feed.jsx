'use client'

import { useState, useEffect } from 'react'

import PromptCard from './PromptCard'
import { set } from 'mongoose'

const PromptCardList = ({ data, handleTagClick }) => {
	return (
		<div className="mt_16 prompt_layout">
			{ data.map( (post) => (
				<PromptCard 
					key={post._id}
					post={post}
					handleTagClick={handleTagClick}
				/>
			))}
		</div>
	)
}

const Feed = () => {
	const [posts, setPosts] = useState([]);

	const [searchText, setSearchText] = useState('');
	const [searchTimeout, setSearchTimeout] = useState(null);
	const [searchResults, setSearchResults] = useState([]);

	const filterPrompts = (searchParam) => {
		const regex = new RegExp(searchParam, "i"); // 'i' flag for case-insensitive search

		return posts.filter(
			(item) =>
				regex.test(item.creator.username) ||
				regex.test(item.tag) ||
				regex.test(item.prompt)
		);
	}

	const handleSearchChange = (e) => {
		clearTimeout(searchTimeout);
		setSearchText(e.target.value);

		// Debounce search
		setSearchTimeout(
			setTimeout(() => {
				const results = filterPrompts(e.target.value);
				setSearchResults(results);
			}, 500)
		);
	}

	const handleTagClick = (tag) => {
		setSearchText(tag);
		setSearchResults(filterPrompts(tag));
	}

	useEffect(() => {
		const fetchPosts = async () => {
			const response = await fetch('/api/prompt');
			const data = await response.json();

			setPosts(data);
		}

		fetchPosts();
	}, []);

	return (
		<section className="feed">
			<form
				className="relative w-full flex-center"
			>
				<input
					type="text"
					placeholder="Search for a tag or username"
					value={searchText}
					onChange={handleSearchChange}
					className="search_input peer"
					required
				/>
			</form>

			{searchText && (
				<PromptCardList 
					data={searchResults}
					handleTagClick={handleTagClick}
				/>
			)}

			{!searchText && (
				<PromptCardList 
					data={posts}
					handleTagClick={handleTagClick}
				/>
			)}
			
		</section>
	)
}

export default Feed