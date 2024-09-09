"use client"
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

interface NavItem {
    title: string;
    url?: string;
    children?: NavItem[];
}

const navigationData: NavItem[] = [
    { title: 'Home', url: '/home' },
    {
        title: 'Products',
        children: [
            { title: 'Men', url: '/products/men' },
            { title: 'Women', url: '/products/women' },
            {
                title: 'Electronics',
                children: [
                    { title: 'Phones', url: '/products/electronics/phones' },
                    { title: 'Laptops', url: '/products/electronics/laptops' },
                ],
            },
            {
                title: 'careers',
                children: [
                    { title: 'jobs', url: '/products/careers/jobs' },
                    { title: 'training', url: '/products/careers/training' },
                ],
            },
        ],
    },
    {
        title: 'Services',
        children: [
            { title: 'Same Day Delivery', url: '/services/same-day-delivery' },
            { title: 'Customized Services', url: '/services/customized-services' },
        ],
    },
    { title: 'About', url: '/about' },
    { title: 'Contact', url: '/contact' },
];

const Navigation = () => {
    const router = useRouter();

    // Track the navigation path as an array of indices in the list hierarchy
    const [path, setPath] = useState<{ index: number; title: string }[]>([]);

    /* use useMemo to store the current list so it grabs the stored value 
    on every re-render as long as the dependency is unchanged  */
    const currentList: NavItem[] = useMemo(() => {
        // console.log(path)
        let list = navigationData;
        path.map(({ index }) => {
            list = list[index].children || [];
        });
        // console.log(list)
        return list;
    }, [path]);

    const handleClick = (itemIndex: number): void => {
        //index of the selected item in the list
        const selectedItem = currentList[itemIndex];
        // console.log(selectedItem)
        //if selected index has a url value then navigate to url
        if (selectedItem.url) {
            router.push(selectedItem.url);
            /*if selected index has children then push the index of list
            to 'path' state variable 
            */
        } else if (selectedItem.children) {
            setPath((prevPath) => [...prevPath, { index: itemIndex, title: selectedItem.title }]);
        }
    };

    const handleBack = (): void => {
        if (path.length > 0) {
            // console.log(path)
            /* Remove the last element from the "path" state
            leaving just the index of the parent title
            */
            setPath((prevPath) => prevPath.slice(0, -1));
        }
    };

    const parentTitle = path.length > 0 ? path[path.length - 1].title : '';

    return (
        <div>
            {path.length > 0 && (
                <div>
                    <button onClick={handleBack}>{`Back to ${parentTitle}`}</button>
                </div>
            )}

            <ul>
                {currentList.map((item, index) => (
                    <li key={item.title} onClick={() => handleClick(index)} style={{ cursor: 'pointer', display: 'flex' }}>
                        {item.title}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Navigation;
