import React from 'react';
import BountyCard from '../../../../components/cards/BountyCard';
import { currentUser } from '@clerk/nextjs';
import { redirect } from "next/navigation";
import { fetchUser } from "../../../../lib/actions/user.actions";
import { fetchBountyById } from "../../../../lib/actions/bounty.actions";
import Comment from '../../../../components/forms/Comment';

export const revalidate = 0;

const Page = async ({ params }: { params: { id: string }}) => {
    if(!params.id) return null;

    const user = await currentUser();
    if(!user) return null;

    const userInfo = await fetchUser(user.id);
    if(!userInfo?.onboarded) redirect('/onboarding');

    const bounty = await fetchBountyById(params.id);

    
    return (
        <section className="relative">
            <div>
                <BountyCard 
                    key={bounty._id}
                    id={bounty._id}
                    currentUserId={user?.id || ""}
                    parentId={bounty.parentId}
                    content={bounty.text}
                    author={bounty.author}
                    community={bounty.community}
                    createdAt={bounty.createdAt}
                    comments={bounty.children}
                /> 
            </div>

            <div className="mt-7">
                <Comment 
                bountyId={bounty.id}
                currentUserImg={userInfo.image}
                currentUserId={JSON.stringify(userInfo._id)}
                />
            </div>


            <div className="mt-10">
                {Array.isArray(bounty.children) && bounty.children.map((childItem: any) => (
                    <BountyCard
                        key={childItem._id}
                        id={childItem._id}
                        currentUserId={user?.id || ""}
                        parentId={childItem.parentId}
                        content={childItem.text}
                        author={childItem.author}
                        community={childItem.community}
                        createdAt={childItem.createdAt}
                        comments={childItem.children}
                        isComment
                    />
                ))}
            </div>
        </section>
    )
}

export default Page;