'use client';
import { TComment } from '@/types/screen-settings';
import { useEffect, useState } from 'react';
import ImgFromDb from './ImgFromDb';
import { useSession } from 'next-auth/react';
import ShowIcon from './svg/showIcon';
type Props = {
  postSlug: string;
};

function Comments({ postSlug }: Props) {
  const [comments, setComments] = useState<TComment[]>([]);
  const [commentInput, setCommentInput] = useState('');
  const [commentEdit, setCommentEdit] = useState('');
  const [editableComment, setEditableComment] = useState<number | null>(null);
  const { data: session } = useSession();
  useEffect(() => {
    fetch('/api/posts/' + postSlug + '/comments', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setComments(data.post.sort((a: any, b: any) => {
            if (a.createdAt > b.createdAt) return 1;
            else if (a.createdAt < b.createdAt) return -1;
            else return 0;
          }));
      });
  }, [postSlug]);
  return (
    <div className="w-full flex flex-col justify-center items-center">
      {comments != undefined &&
        comments.length > 0 &&
        comments.map((comment, index) => (
          <div key={comment.id} className="flex flex-row w-full border-b-4 border-radius-md ">
            <div className="w-1/3 md:max-w-[300px] flex flex-col justify-center items-center">
              <ImgFromDb
                url={comment.user.image}
                stylings="object-contain h-10 w-10"
                alt="User picture"
              />
              <div className="text-center">{comment.user.name}</div>

              <div>
                {new Date(comment.createdAt).toLocaleDateString('en-us', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
              <div>
                {new Date(comment.createdAt).toLocaleTimeString('en-US', {
                  timeStyle: 'short',
                })}
              </div>
              <div className="w-full  flex flex-row justify-center items-center text-center">
                {(session?.user.id === comment.userID ||
                  session?.user.role == 'Admin') && (
                  <button
                    className=" outline-none border-none fill-alertcolor  stroke-alertcolor  rounded-md border-alertcolor p-1 w-8 h-8"
                    onClick={(e) => {
                      e.preventDefault();
                      fetch('/api/posts/' + postSlug + '/comments/', {
                        method: 'DELETE',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          id: comment.id,
                        }),
                      })
                        .then((response) => response.json())
                        .then((data) => {
                          console.log(data);
                          window.location.reload();
                        });
                    }}
                  >
                    <ShowIcon icon={'Close'} stroke={'1'} />
                  </button>
                )}
                {(session?.user.id === comment.userID ||
                  session?.user.role == 'Admin') && (
                  <button
                    className=" outline-none border-none fill-editcolor  stroke-editcolor  rounded-md border-editcolor p-1 w-8 h-8"
                    onClick={(e) => {
                      e.preventDefault();
                      setEditableComment(index);
                      setCommentEdit(comment.desc);
                    }}
                  >
                    <ShowIcon icon={'Edit'} stroke={'.5'} />
                  </button>
                )}
              </div>
            </div>
            {editableComment !== index ? (
              <p className="w-2/3 h-auto flex justify-center items-center text-center">
                {comment.desc}
              </p>
            ) : (
              <div className="w-2/3 h-auto flex justify-center items-center text-center">
                <textarea
                  className="flex-1 outline-none w-3/4 bg-menuBGColor text-darkMainColor dark:text-menuBGColor dark:bg-darkMainColor border-none rounded-md bg-main-bg p-0.5 mx-1 my-1"
                  placeholder="Enter your comment here"
                  rows={3}
                  onChange={(e) => {
                    setCommentEdit(e.target.value);
                  }}
                  value={commentEdit}
                />
                {commentEdit !== comment.desc && commentEdit !== '' && (
                  <button
                    className="btnFancy text-center"
                    style={{ padding: 0 }}
                    onClick={() => {
                      fetch('/api/posts/' + postSlug + '/comments', {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          desc: commentEdit,
                          id: comment.id,
                        }),
                      })
                        .then((response) => response.json())
                        .then((data) => {
                          console.log(data);
                          window.location.reload();
                        });
                      setCommentEdit('');
                    }}
                  >
                    Send
                  </button>
                )}
              </div>
            )}
            
          </div>
          
        ))}
      {session?.user.id! ? (
        <div className="w-full flex flex-col justify-center items-center">
          <label className="w-full flex flex-col items-center justify-center">
            Leave your comment:
            <textarea
              className="flex-1 outline-none w-3/4 bg-menuBGColor text-darkMainColor dark:text-menuBGColor dark:bg-darkMainColor border-none rounded-md bg-main-bg p-0.5 mx-1 my-1"
              placeholder="Enter your comment here"
              rows={5}
              onChange={(e) => {
                setCommentInput(e.target.value);
              }}
              value={commentInput}
            />
          </label>
          {commentInput.length != 0 && (
            <button
              className="btnFancy text-center w-24"
              style={{ padding: 0 }}
              onClick={() => {
                fetch('/api/posts/' + postSlug + '/comments', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    desc: commentInput,
                    userID: session.user.id,
                  }),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    console.log(data);
                    window.location.reload();
                  });
                setCommentInput('');
              }}
            >
              Send
            </button>
          )}
        </div>
      ) : (
        <div className="w-full flex flex-col justify-center items-center">
          Please register to comment
        </div>
      )}
    </div>
  );
}

export default Comments;
