const imageInput = document.querySelector("[data-image-input]");
const previews = document.querySelector("[data-image-previews]");
const imageCount = document.querySelector("[data-image-count]");
const problem = document.querySelector("[data-problem]");
const emptyIntro = document.querySelector("[data-empty-intro]");
const stream = document.querySelector("[data-conversation-stream]");
const fieldPanel = document.querySelector("[data-field-panel]");
const fieldToggle = document.querySelector("[data-field-toggle]");
let selectedImages = [];

const revokePreviews = () => selectedImages.forEach((item) => URL.revokeObjectURL(item.url));

const renderImages = () => {
  previews.replaceChildren();
  selectedImages.forEach((item, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "image-preview";
    const image = document.createElement("img");
    image.src = item.url;
    image.alt = `รูปที่เลือก ${index + 1}: ${item.file.name}`;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "image-remove";
    remove.setAttribute("aria-label", `นำรูป ${item.file.name} ออก`);
    remove.textContent = "×";
    remove.addEventListener("click", () => {
      URL.revokeObjectURL(item.url);
      selectedImages = selectedImages.filter((candidate) => candidate !== item);
      renderImages();
    });
    wrapper.append(image, remove);
    previews.append(wrapper);
  });
  const hasImages = selectedImages.length > 0;
  previews.hidden = !hasImages;
  imageCount.hidden = !hasImages;
  imageCount.textContent = `เลือกรูปแล้ว ${selectedImages.length} รูป · อยู่ในเบราว์เซอร์ชั่วคราว`;
};

imageInput?.addEventListener("change", () => {
  const files = [...(imageInput.files ?? [])].filter((file) => file.type.startsWith("image/"));
  selectedImages.push(...files.map((file) => ({ file, url: URL.createObjectURL(file) })));
  imageInput.value = "";
  renderImages();
});

fieldToggle?.addEventListener("click", () => {
  fieldPanel.hidden = !fieldPanel.hidden;
  fieldToggle.setAttribute("aria-expanded", String(!fieldPanel.hidden));
});

document.querySelectorAll("[data-quick-starters] button").forEach((button) => button.addEventListener("click", () => {
  problem.value = button.textContent === "ไม่แน่ใจว่าเกิดจากอะไร" ? "ไม่แน่ใจว่าเกิดจากอะไร พบว่า " : `${button.textContent}: `;
  problem.focus();
}));

document.querySelector("[data-submit]")?.addEventListener("click", () => {
  const message = problem.value.trim() || "ข้าวประมาณ 45 วัน ใบมีจุดสีน้ำตาลหลายจุด";
  document.querySelector("[data-user-message]").textContent = message;
  document.querySelector("[data-received-summary]").textContent = message;
  emptyIntro.hidden = true;
  stream.hidden = false;
  stream.scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelector("[data-new-case]")?.addEventListener("click", () => {
  emptyIntro.hidden = false;
  stream.hidden = true;
  problem.value = "";
  problem.focus();
});

document.querySelector("[data-answer]")?.addEventListener("click", () => problem.focus());
document.querySelector("[data-skip]")?.addEventListener("click", () => problem.focus());
window.addEventListener("pagehide", revokePreviews);
