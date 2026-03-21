import { useLogin } from "../../context/LoginContex";
import { LogOut, X } from "lucide-react";

interface LogoutModalProps {
  onClose: () => void;
}

function LogoutModal({ onClose }: LogoutModalProps) {
  const { logout } = useLogin();
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-base-elevated border border-border rounded-md w-[90%] max-w-sm p-6 flex flex-col gap-5 animate-scaleIn shadow-2xl"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-red-500/10 flex items-center justify-center">
              <LogOut size={16} className="text-red-400" />
            </div>
            <div>
              <h2 className="text-sm font-black text-text-primary">Sign Out</h2>
              <p className="text-[11px] text-text-muted">
                You'll be returned to the login screen
              </p>
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
          Are you sure you want to sign out? Any unsaved changes will be lost.
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
              logout();
              onClose();
            }}
          >
            <LogOut size={13} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutModal;
