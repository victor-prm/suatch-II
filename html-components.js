function card(name, hex, rgb, category) {
    return `<div class="item" style="box-shadow: 4px 4px 24px ${hex}66";>
    <div class="color-sample" style="background-color: ${name};">
    </div>
    <div class="color-info">
        <h3>${formatName(name)}</h3>
        <div class="item-details-container">
            <div class="item-details-left">
                <div class="item-detail">
                    <p class="item-detail-name">hex</p>
                    <p class="item-detail-value">${hex}</p>
                </div>
                 <div class="item-detail">
                    <p class="item-detail-name">rgb</p>
                    <p class="item-detail-value">${rgb}</p>
                </div>
             </div>
            <div class="item-details-right">
                 <div class="item-detail">
                    <p class="item-detail-name">hsl</p>
                    <p class="item-detail-value">${hexToHSL(hex)}</p>
                </div>
                <div class="item-detail">
                    <p class="item-detail-name">cat</p>
                    ${categoryContainer(category)}
                </div>
            </div>
        </div>
    </div>
</div>`
}

function categoryContainer(category) {
    return `<div class="category-container" onmousedown="changeCategorySelection('${category}')">
        <p class="item-detail-value">${category}</p>
        <div class="item-category" style="background-color: ${category}"></div>
    </div>`
}


function formatName(colorName) {
    let splitString = colorName.split(/(?=[A-Z])/);
    let newInnerHtml = "";
    splitString.forEach(element => {
        newInnerHtml += `<span class="color-name-buffer">${element}</span>`;
    });
    return newInnerHtml;
}

