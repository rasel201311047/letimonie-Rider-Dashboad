import { useState } from "react";
import Typebox from "../typepage/Typebox";

export default function PrivacyPolicy() {
  const [content, setContent] = useState(`
By using the app, you agree to create an account and keep your login information secure. Users can book appointments, and service providers manage availability and appointments. Payments are handled between users and providers. Follow the provider's cancellation and refund policy. You must use the app responsibly, and we are not liable for any issues. The terms may change, and by continuing to use the app, you agree to any updates. For questions, contact us at [Contact Email]..

By using the app, you agree to create an account and keep your login information secure. Users can book appointments, and service providers manage availability and appointments. Payments are handled between users and providers. Follow the provider's cancellation and refund policy. You must use the app responsibly, and we are not liable for any issues. The terms may change, and by continuing to use the app, you agree to any updates. For questions, contact us at [Contact Email].

Education also nurtures empathy and cultural awareness, fostering a more inclusive and understanding society. By learning about diverse perspectives and histories, we become more open-minded and respectful of differences, which is crucial in a world that is increasingly interconnected. This cultural competence not only enhances personal relationships but also strengthens international collaboration and peace.`);

  const handleSave = () => {
    console.log("Saved content:", content);
  };

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="flex justify-around items-center mb-[3%]">
        <div></div>
        <div className="text-[#0F0B18] text-2xl font-bold ">Privacy Policy</div>
        <div></div>
      </div>
      <Typebox value={content} onChange={setContent} onSave={handleSave} />
    </main>
  );
}
