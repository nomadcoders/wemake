import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "~/supa-client";

export const createPost = async (
  client: SupabaseClient<Database>,
  {
    title,
    category,
    content,
    userId,
  }: {
    title: string;
    category: string;
    content: string;
    userId: string;
  }
) => {
  const { data: categoryData, error: categoryError } = await client
    .from("topics")
    .select("topic_id")
    .eq("slug", category)
    .single();
  if (categoryError) {
    throw categoryError;
  }
  const { data, error } = await client
    .from("posts")
    .insert({
      title,
      content,
      profile_id: userId,
      topic_id: categoryData.topic_id,
    })
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data;
};

export const createReply = async (
  client: SupabaseClient<Database>,
  { postId, reply, userId }: { postId: string; reply: string; userId: string }
) => {
  const { error } = await client
    .from("post_replies")
    .insert({ post_id: Number(postId), reply, profile_id: userId });
  if (error) {
    throw error;
  }
};
