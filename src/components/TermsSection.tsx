

interface detailprops{
    title:string;
    description?:string;
    contentList:string[];
}

function TermSection({title, description, contentList}:detailprops){
    return(
        <section id={title} className="mb-8 text-justify">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">{title}</h2>
            {description && <p>{description}</p>}
            <ul className="list-disc pl-6 mt-2 text-justify">
                {contentList.map((content, index) => (
                    <li key={index}>{content}</li>
                ))}
            </ul>
        </section>
    );
};

export default TermSection;