import React from "react";
import { fetchBounties } from "../../lib/actions/bounty.actions";
import { currentUser } from "@clerk/nextjs";
import BountyCard from "../../components/cards/BountyCard";

export default async function Home() {
  const result = await fetchBounties(1, 30);
  const user = await currentUser();

  return (
    <>
      <h1 className="head-text text left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result">No bounties found</p>
        ) : (
          <>
          {result.posts.map((post) => (
            <BountyCard 
            key={post._id}
            id={post._id}
            currentUserId={user?.id || ""}
            parentId={post.parentId}
            content={post.text}
            author={post.author}
            community={post.community}
            createdAt={post.createdAt}
            comments={post.children}
            />
          ))}
          </>
        ) }
      </section>
    </>
  )
}