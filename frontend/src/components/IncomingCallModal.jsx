const IncomingCallModal = ({ caller, onAccept, onDecline }) => {
  if (!caller) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-80 text-center">
        <h3 className="font-bold text-lg mb-2">
          📞 Incoming Call
        </h3>
        <p className="text-sm mb-4">
          {caller.user?.name || "Someone"} is calling you
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onDecline}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Decline
          </button>
          <button
            onClick={onAccept}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
