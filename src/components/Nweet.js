const Nweet = ({ nweetObj }) => {
  return (
    <div>
      <h4>{nweetObj.text}</h4>
      <button>Delete Nweet</button>
      <button>Edit Nweet</button>
    </div>
  )
}

export default Nweet;