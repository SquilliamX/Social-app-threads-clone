import React from 'react';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation'
import { fetchUser } from '../../../lib/actions/user.actions';
import PostBounty from '../../../components/forms/PostBounty';

async function Page() {
    const user = await currentUser();

    if(!user) return null;

    const userInfo = await fetchUser(user.id);

    if(!userInfo?.onboarded) redirect('/onboarding');
    
    return (
    <>
    <h1 className="head-text">Create Bounty</h1>

    <PostBounty userId={userInfo._id} />
    </>
    );
}

export default Page;