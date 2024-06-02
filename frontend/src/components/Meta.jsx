import {Helmet} from "react-helmet-async"

const Meta = ( {title, description, keywords}) => {
  return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" contents={keywords} />
            
        </Helmet>
  )
}

Meta.defaultProps = {
    title: "Welcome to ProShop",
    description: "We sell products",
    keywords: "electronics"
}

export default Meta
