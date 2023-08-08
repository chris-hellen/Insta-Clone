import { useEffect, useState, useContext, useCallback } from 'React';
import axios from 'axios';
import Detail from './Detail';
import context from '../../context';

const Share = (props) => {
    const params = props.match.params;
    const [ hasPost, setHasPost ] = useState(false);
    const { setIsLoading, setSelectedPost } = useContext(context);

    let loadPost = null;

    useEffect (() => {
        loadPost();
    }, [loadPost]);

    loadPost = useCallback(async () => {
        const postId = params.id;
        if (!postId){
            return;
        }
        try {
            setIsLoading(true);
            const url = `http://localhost:8000/posts/${postId}`;
            const response = await axios.get(url);
            if (response && response.data &&  response.data.message){
                alert(response.data.message);
                setIsLoading(false);
                return;
            }
            else {
                setSelectedPost(response.data[0]);
                setHasPost(true);
            }
        }
        catch (error) {
            setIsLoading(false);
        }
    }, [setIsLoading, params, setSelectedPost]);

    if (!hasPost){
        return <></>;
    }

    return <Detail isCloseHidden = {true} />;
};

export default Share; 