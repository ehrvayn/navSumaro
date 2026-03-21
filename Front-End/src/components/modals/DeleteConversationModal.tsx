import { OctagonAlert, X } from "lucide-react";

interface DeleteConversationModalProps {
  onClose: () => void;
  handleDeleteConvo: () => void

}

function DeleteConversationModal({ onClose, handleDeleteConvo }: DeleteConversationModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-base-elevated border border-border rounded-md w-[90%] max-w-sm p-6 flex flex-col gap-5 animate-scaleIn shadow-2xl"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-red-500/10 flex items-center justify-center">
              <OctagonAlert size={20} className="text-red-400" />
            </div>
            <div>
              <h2 className="text-sm font-black text-text-primary">
                Delete Conversation
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:bg-base-hover hover:text-text-primary transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <p className="text-[13px] text-text-secondary leading-relaxed">
          Are you sure you want to Delete this Conversation?
        </p>

        <div className="flex gap-2.5 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-[12px] font-semibold text-text-muted bg-base-hover hover:bg-base-surface border border-border transition-colors"
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-md text-[12px] font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors flex items-center gap-1.5"
            onClick={() => {
              handleDeleteConvo();
              onClose();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConversationModal;
