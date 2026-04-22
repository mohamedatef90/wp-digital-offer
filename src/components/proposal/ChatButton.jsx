import { MessageCircle } from 'lucide-react'

function ChatButton() {
  return (
    <div className="fixed bottom-6 right-6 z-[300]">
      <button aria-label="Chat with support" className="w-14 h-14 rounded-full bg-brand-green border-none shadow-[0_8px_32px_rgba(103,154,65,0.4)] cursor-pointer flex items-center justify-center transition-transform duration-200 hover:scale-110 focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900 focus-visible:outline-none">
        <MessageCircle size={24} color="#fff" />
      </button>
    </div>
  )
}

export default ChatButton
