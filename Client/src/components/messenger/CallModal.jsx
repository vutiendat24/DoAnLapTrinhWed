import React, { useState, useEffect, useRef } from "react";
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff, Volume2 } from "lucide-react";
import { useSocketContext } from "../../context/SocketContext";

const CallModal = ({
  isOpen,
  callType,
  isIncoming,
  caller,
  recipient,
  onAccept,
  onReject
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(callType === "video");
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState(isIncoming ? "incoming" : "calling");

  const callStartTimeRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const {
    localStream,
    remoteStream,
    isCallConnected,
    handleEndCall
  } = useSocketContext();

  useEffect(() => {
    if (isCallConnected && !callStartTimeRef.current) {
      callStartTimeRef.current = Date.now();
      setCallStatus("connected");
    }
  }, [isCallConnected]);

  useEffect(() => {
    let interval;
    if (callStatus === "connected") {
      interval = setInterval(() => {
        if (callStartTimeRef.current) {
          setCallDuration(Math.floor((Date.now() - callStartTimeRef.current) / 1000));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getCallStatusText = () => {
    switch (callStatus) {
      case "incoming":
        return `Incoming ${callType} call from ${caller?.name}`;
      case "calling":
        return `Calling ${recipient?.name}...`;
      case "connected":
        return formatDuration(callDuration);
      default:
        return "";
    }
  };

  if (!isOpen) return null;

  return (
   <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
  <div className="bg-white rounded-2xl p-6 w-full h-full max-w-4/5 max-h-9/12 mx-4 relative overflow-hidden">

    {/* Remote Video + Control cùng 1 thẻ relative */}
    {callType === "video" && (
      <div className="absolute inset-0 ">
        {remoteStream ? (
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
        ) : (
              <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-semibold">{(recipient?.name || caller?.name)?.charAt(0)}</span>
                  </div>
                  <p>Waiting for video...</p>
                </div>
              </div>
            )}

        {/* Controls nằm dưới cùng video */}
        <div className="absolute  bottom-4 left-0 right-0 flex justify-center space-x-4 z-20">
          {isIncoming && callStatus === "incoming" ? (
            <>
              <button onClick={onReject} className="bg-red-500 p-4 rounded-full"><PhoneOff /></button>
              <button onClick={onAccept} className="bg-green-500 p-4 rounded-full"><Phone /></button>
            </>
          ) : (
            <>
              {callStatus === "connected" && (
                <>
                  <button onClick={toggleMute} className="bg-gray-200 p-4 rounded-full">
                    {isMuted ? <MicOff /> : <Mic />}
                  </button>
                  {callType === "video" && (
                    <button onClick={toggleVideo} className="bg-gray-200 p-4 rounded-full">
                      {isVideoEnabled ? <Video /> : <VideoOff />}
                    </button>
                  )}
                  <button className="bg-gray-200 p-4 rounded-full"><Volume2 /></button>
                </>
              )}
              <button onClick={handleEndCall} className="bg-red-500 p-4 rounded-full"><PhoneOff /></button>
            </>
          )}
        </div>
      </div>
    )}

    {/* Info + Local Video */}
    <div className={`relative z-10 ${callType === "video" && callStatus === "connected" ? "text-white" : "text-gray-900"}`}>
      <div className="text-center text-amber-300 mb-6">
        <h3 className="text-xl  font-semibold mb-2">{isIncoming ? caller?.name : recipient?.name}</h3>
        <p>{getCallStatusText()}</p>
      </div>

      {/* Local Video nhỏ góc phải */}
      {callType === "video" && localStream && (
        <div className="absolute top-1 right-4 w-80 h-40 bg-gray-900 rounded-lg overflow-hidden border-2 border-white z-30">
          <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  </div>
</div>

  );
};

export default CallModal;
