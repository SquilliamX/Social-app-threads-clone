"use server"

import Bounty from "../models/bounty.model";
import { connectToDB } from "../mongoose"
import User from "../models/user.model";
import { revalidatePath } from "next/cache";

interface Params {
    text: string;
    author: string;
    communityId: string | null;
    path: string;
}

export async function createBounty({ text, author, communityId, path }: Params) {
    try {
        connectToDB();

        const createdBounty = await Bounty.create({
            text,
            author,
            community: null,
        });

        // Update user model
        await User.findByIdAndUpdate(author, {
            $push: { bounties: createdBounty._id }
        });

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Error creating bounty: ${error.message}`);
    }
}

export async function fetchBounties(pageNumber = 1, pageSize = 20) {
    connectToDB();

    //calculate the number of posts to skip
    const skipAmount = (pageNumber - 1) * pageSize;

    // fetch the posts that have no parents (top-level bounties)
    const postsQuery = Bounty.find({ parentId: { $in: [null, undefined] as any } })
        // 'desc' means descending order, meaning the newest posts will be first
        // we want to update this later on to make it so that the bounties with the highest TVL is first.
        .sort({ createdAt: 'desc' })
        .skip(skipAmount)
        .limit(pageSize)
        .populate({ path: 'author', model: User })
        .populate({
            path: 'children',
            populate: {
                path: 'author',
                model: User,
                select: "_id name parentId image"
            }
        })

    const totalPostCount = await Bounty.countDocuments({ parentId: { $in: [null, undefined] as any } });

    const posts = await postsQuery.exec();

    const isNext = totalPostCount > skipAmount + posts.length;

    return { posts, isNext };
}

export async function fetchBountyById(id: string) {
    connectToDB();

    try {
        const bounty = await Bounty.findById(id)
            .populate({
                path: 'author',
                model: User,
                select: "_id id name image"
            })
            .populate({
                path: 'children',
                model: Bounty,
                populate: [
                    {
                        path: 'author',
                        model: User,
                        select: "_id id name parentId image"
                    },
                    {
                        path: 'children',
                        model: Bounty,
                        populate: {
                            path: 'author',
                            model: User,
                            select: "_id id name parentId image"
                        }
                    }
                ]
            }).exec();

        return bounty;
    } catch (error: any) {
        throw new Error(`Error fetching bounty: ${error.message}`);
    }
}

export async function addCommentToBounty(
    bountyid: string,
    commentText: string,
    userId: string,
    path: string,
  ) {
    connectToDB();
  
    try {
      const originalBounty = await Bounty.findById(bountyid);
      console.log("Original Bounty:", originalBounty);
  
      if (!originalBounty) {
        throw new Error("Bounty not found");
      }
  
      const commentBounty = new Bounty({
        text: commentText,
        author: userId,
        parentId: bountyid
      });
  
      const savedCommentBounty = await commentBounty.save();
      console.log("Saved Comment Bounty:", savedCommentBounty);
  
      await Bounty.findByIdAndUpdate(
        bountyid,
        { $push: { children: savedCommentBounty._id } },
        { new: true }
      );
  
      console.log("Updated Original Bounty:", originalBounty);
  
      revalidatePath(path);
    } catch (err: any) {
      console.error("Error while adding comment:", err);
      throw new Error(`Unable to add comment: ${err.message}`);
    }
  }