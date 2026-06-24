import { useAuthStore } from '../../store/useAuthStore';
import BorderAnimatedContainer from '../../components/BorderAnimatedContainer';

function ChatPage() {
    const { authUser, signout  } = useAuthStore();
 
    return (
        <div className="w-full flex items-center justify-center p-4 bg-slate-900">
            <div className="relative w-full max-w-6xl md:h-[800px] h-[650px]">
            <BorderAnimatedContainer>
                <button className="btn btn-primary" onClick={signout}>Sign out</button>
            </BorderAnimatedContainer>
            </div>
        </div>
    )
}

export default ChatPage;