import './Demographic.scss'

export default function Demographics() {

    return (
        <>
            <main className="demographicsMainContent">
                <div className='demographicCard men'>
                    <a>Men</a>
                </div>
                <div className='demographicCard women'>
                    <a>Woman</a>
                </div>
                <div className='demographicCard child'>
                    <a>Kids</a>
                </div>
            </main>
        </>
    )
}