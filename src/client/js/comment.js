const videoContainer = document.getElementById("videoContainer");
const videoComments = document.querySelector(".video__comments");
const videoAddForm = document.getElementById("commentForm");

const addComment = (content, id) => {
  const newComment = document.createElement("div");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const spanL = document.createElement("span");
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  spanL.appendChild(icon);
  const spanText = document.createElement("span");
  spanText.innerText = ` ${content}`;
  spanL.appendChild(spanText);
  newComment.appendChild(spanL);
  const spanR = document.createElement("span");
  spanR.className = "video__comment_remove";
  spanR.innerText = "❌";
  spanR.addEventListener("click", handleCommentRemove);
  newComment.appendChild(spanR);
  videoComments.prepend(newComment);
};

const handleCommentAdd = async (event) => {
  event.preventDefault();
  const videoId = videoContainer.dataset.id;
  const textarea = videoAddForm.querySelector("textarea");
  const content = textarea.value.trim();
  if (content === "") return;

  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });
  // content.js:1 Uncaught (in promise) The message port closed before a response was received.
  console.log("handleCommentAdd", response.status);
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(content, newCommentId);
  }
};

if (videoAddForm) {
  videoAddForm.addEventListener("submit", handleCommentAdd);
}

const handleCommentRemove = async (event) => {
  event.preventDefault();
  const videoId = videoContainer.dataset.id;
  const videoComment = event.target.parentElement;
  const commentId = videoComment.dataset.id;
  console.log("handleCommentRemove", videoId, commentId);
  if (!commentId) return;

  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: commentId }),
  });
  console.log("handleCommentRemove", response.status);
  if (response.ok || response.status === 204) {
    videoComment.remove();
  }
};

const commentRemoveButtons = document.querySelectorAll(
  ".video__comment_remove"
);
commentRemoveButtons.forEach((button) => {
  button.addEventListener("click", handleCommentRemove);
});
