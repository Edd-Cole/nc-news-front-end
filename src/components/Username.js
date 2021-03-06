import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import LogOut from "./LogOut";
import Voting from "./Voting";
import EditUser from "./EditUser";
import DeleteUser from "./DeleteUser";

const Username = ({vote, setVote, setPage, currentUser, setCurrentUser}) => {
    const [user, setUser] = useState({})
    const [userArticles, setUserArticles] = useState([])
    const {username} = useParams();

    useEffect(() => {
        fetch(`https://eddncnewsproject.herokuapp.com/api/users/${username}`)
        .then(response => response.json())
        .then(({users}) => setUser(users))
        fetch(`https://eddncnewsproject.herokuapp.com/api/articles?author=${username}`)
        .then(response => response.json())
        .then(({articles}) => {
            setUserArticles(articles)})
        }, [username])

        return (
            <section>
                {currentUser === user.username ? <h2>Hello, {user.name}!</h2> : null}
                {currentUser === user.username ? <LogOut setCurrentUser={setCurrentUser} /> : null}
                <br />
                {currentUser === user.username ? <DeleteUser user={user} /> : null}
                {currentUser === user.username ? <EditUser currentUser={currentUser} /> : null}
                <br /><br />
                <Link to="/users">Back to Users</Link>
                <h2>{user.username}</h2>
                <br></br>
                <img className="userAvatar" src={user.avatar_url} alt={user.username}></img>
                <br />
                <h3>Articles by {username}</h3>
                {userArticles.map(article => {
                    const commentLink = `/articles/${article.article_id}/comments`;
                    const userLink = `/users/${article.author}`
                    return <section className="articleHomepage" key={article.article_id}>
                    <Voting article={article} setVote={setVote} articles={userArticles} setArticles={setUserArticles} vote={vote}/>
                    <Link className="articleLink" to={`/articles/${article.article_id}`}>
                    <section className="articleTitle">
                        <h3>{article.title}</h3>
                        <p>{article.body.length > 75 ? article.body.slice(0,71) + "..." : article.body}</p>
                    </section>
                    </Link>
                    <section className="articleInfo">
                        <p><Link to={`/?topic=${article.topic}`}>t/{article.topic}</Link> &nbsp;-&nbsp; 
                        {article.comment_count} <Link to={commentLink} onClick={() => setPage(1)}>Comments</Link> &nbsp;-&nbsp; 
                        <Link to={userLink}>{article.author.length < 10 ? article.author : article.author.slice(0,6) + "..."}</Link> &nbsp;- &nbsp;
                        {article.created_at.slice(0,10)}</p>
                    </section>
                </section>
                })}
            </section>
        )
    
    
}

export default Username;