import { FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon, WhatsappShareButton, WhatsappIcon, EmailShareButton, EmailIcon} from "react-share";
type Props = {
    url: string;
    title: string;
    quote: string;
    hashtag: string;
  };

function SharePost({ url, title,quote, hashtag }: Props) {
    // sets buttons to share test information on networks
    var socialMediaButton = {
        "&:hover > svg": {
            height: "50px !important",
            width: "50px !important",
        }
    }
    return (
        <div>
            <FacebookShareButton
                url={url} 
                hashtag={hashtag} 
            >
                <FacebookIcon size={36} round={true}/>
            </FacebookShareButton>
            <TwitterShareButton
                url={url}
                title={title+'\n'+quote} 
                hashtags={hashtag.split(' ')} 
            >
                <TwitterIcon size={36} round={true}/>
            </TwitterShareButton>
            <WhatsappShareButton
                url={url}
                title={title+'\n'+quote}
                separator=":: " // text to separate title from quote
            >
                <WhatsappIcon size={36} round={true}/>
            </WhatsappShareButton>

            <EmailShareButton
                url={url}
                subject={title}
                body={quote+'\n'} 
                >
                <EmailIcon size={36} round={true} />
            </EmailShareButton>
        </div>
    )
}

export default SharePost

 