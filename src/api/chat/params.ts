export interface PostMessageItem {
  role: string;
  content: string;
}
export type PostMessageParams = {
  messages: PostMessageItem[];
};
